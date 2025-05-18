import React from "react";

interface AccountInfoProps {
  formData: {
    email: string;
    password: string;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  nextStep: () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  formData,
  handleChange,
  nextStep,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          minLength={6}
        />
      </div>

      <button type="submit" className="form-submit-btn">
        Next
      </button>
    </form>
  );
};

export default AccountInfo;
