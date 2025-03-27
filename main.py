from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pymongo import MongoClient
from bson.objectid import ObjectId
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import ServerSelectionTimeoutError
from jwt import PyJWTError, decode, encode
import jwt

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

try:
    client = MongoClient(os.getenv("MONGO_URI"), serverSelectionTimeoutMS=5000)
    client.server_info()  # Test connection
    db = client["mydatabase"]
    users_collection = db["users"]
except ServerSelectionTimeoutError:
    raise Exception("Could not connect to MongoDB. Please check your connection.")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCES_TOKEN_EXPIRE_MINUTES = 30

class User(BaseModel):
    name: str
    email: str
    username: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt_token(token)
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.post("/register")
async def register(user: User):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)

    user_data = {
        "name": user.name,
        "email": user.email,
        "username": user.username,
        "password": hashed_password
    }
    users_collection.insert_one(user_data)
    print("User registered successfully:", user_data)
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: LoginUser):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token_data = {
        "user_id": str(db_user["_id"]),
        "email": db_user["email"],
        "name": db_user["name"]
    }

    token = create_jwt_token(token_data)
    return {"message": "Login successful", "token": token}

@app.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    name = str(user.get("name", ""))
    email = str(user.get("email", ""))
    username = str(user.get("username", ""))

    return {
        "name": name,
        "email": email,
        "username": username,
    }

@app.put("/update-profile")
async def update_profile(updated_data: dict, user_id: str = Depends(get_current_user)):
    existing_user = users_collection.find_one({
        "email": updated_data.get("email"),
        "_id": {"$ne": ObjectId(user_id)}
    })
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    update_fields = {}
    if "name" in updated_data:
        update_fields["name"] = updated_data["name"]
    if "email" in updated_data:
        update_fields["email"] = updated_data["email"]
    if "password" in updated_data:
        update_fields["password"] = hash_password(updated_data["password"])

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )
    
    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    return {
        "name": updated_user["name"],
        "email": updated_user["email"],
    }

@app.post("/forgot-password")
async def forget_password(data: dict):
    email = data.get("email")
    username = data.get("username")
    new_password = data.get("new_password")

    if not email or not username or not new_password:
        raise HTTPException(status_code=400, detail="Email, username, and new password are required")
    
    user = users_collection.find_one({"email": email, "username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    hashed_password = hash_password(new_password)
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}}
    )

    return {"message": "Password updated successfully"}