import toast from "react-hot-toast";
import CustomToast from "../components/common/CustomToast";

export const notify = {
  success: (msg: string) =>
    toast.custom((t) => (
      <CustomToast
        type="success"
        message={msg}
        onClose={() => toast.dismiss(t.id)}
      />
    )),

  error: (msg: string) =>
    toast.custom((t) => (
      <CustomToast
        type="error"
        message={msg}
        onClose={() => toast.dismiss(t.id)}
      />
    )),

  warning: (msg: string) =>
    toast.custom((t) => (
      <CustomToast
        type="warning"
        message={msg}
        onClose={() => toast.dismiss(t.id)}
      />
    )),

  info: (msg: string) =>
    toast.custom((t) => (
      <CustomToast
        type="info"
        message={msg}
        onClose={() => toast.dismiss(t.id)}
      />
    )),
};
