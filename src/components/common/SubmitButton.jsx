import React from "react";

function SubmitButton({ label, onclick }) {
    return (
        <button type="submit" className="btn-submit" onClick={onclick}>
            {label}
        </button>
    );
}

export default SubmitButton;