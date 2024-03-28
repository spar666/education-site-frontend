import { Button } from 'antd';
import { deleteCookie } from 'cookies-next';

const LogoutButton = () => {
  // const [logout, { loading }] = useMutation(LOGOUT);

  // function logoutHandler() {
  //   logout()
  //     .then(console.log)
  //     .catch(console.log)
  //     .finally(() => {
  //       deleteCookie("accessToken");
  //       window.location.href = "/";
  //     });
  // }

  return (
    <Button type="primary" className="m-8">
      Log Out
    </Button>
  );
};

export default LogoutButton;
