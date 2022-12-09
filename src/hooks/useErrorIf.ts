import { useState, useEffect } from "react";

export const useErrorIf = (condition: boolean) => {
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (isError && !condition) {
      setIsError(false);
    }
  }, [isError, condition]);

  const handleSubmit = (callback: () => void) => {
    if (condition && !isError) {
      setIsError(true);
      return;
    }

    callback();
  };

  return {
    isError,
    handleSubmit,
  };
};
