import { useState, useEffect } from "react";
import { Mail, Plus } from "lucide-react";

const EmailInput = ({ emails = [], onEmailsChange }) => {
  const [inputs, setInputs] = useState(emails.length ? emails : [""]);

  useEffect(() => {
    const validEmails = inputs.filter(
      (email) => email.includes("@") && email.trim() !== ""
    );
    onEmailsChange(validEmails);
  }, [inputs]);

  const handleChange = (value, index) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleAddField = () => {
    setInputs([...inputs, ""]);
  };

  const handleRemoveField = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs.length ? newInputs : [""]);
  };

  return (
    <div>
      {inputs.map((input, index) => (
        <div key={index} className="relative mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={input}
              onChange={(e) => handleChange(e.target.value, index)}
              placeholder="teammate@email.com"
              className="w-full pl-10 pr-4 py-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-1 focus:border-transparent outline-none transition-all"
            />
          </div>
          {inputs.length > 1 && (
            <button
              onClick={() => handleRemoveField(index)}
              className="text-color-1 hover:text-color-2 text-lg font-bold"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        onClick={handleAddField}
        className="flex items-center gap-2 text-color-1 hover:text-color-2 text-sm font-medium mt-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add another email
      </button>
    </div>
  );
};

export default EmailInput;
