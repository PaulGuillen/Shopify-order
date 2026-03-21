import toast from "react-hot-toast";
import CustomToast from "../components/common/CustomToast";

export const notify = {
  success: (msg: string) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="success"
          message={msg}
          toastId={t.id}
          duration={4000}
        />
      ),
      {
        duration: 4000,
        position: "top-right",
      }
    ),

  error: (msg: string) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="error"
          message={msg}
          toastId={t.id}
          duration={4000}
        />
      ),
      { duration: 4000 }
    ),

  warning: (msg: string) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="warning"
          message={msg}
          toastId={t.id}
          duration={4000}
        />
      ),
      { duration: 4000 }
    ),

  info: (msg: string) =>
    toast.custom(
      (t) => (
        <CustomToast
          type="info"
          message={msg}
          toastId={t.id}
          duration={4000}
        />
      ),
      { duration: 4000 }
    ),
};