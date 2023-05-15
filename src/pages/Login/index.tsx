import { useLoginMutation } from '../../services/Login/loginApi';
import { storeDataStorage } from '../../utils/sessionStorage';
export default function Login() {
  const [login] = useLoginMutation();
  const onClickLogin = () => {
    login({ username: 'super', password: 'Password09!' })
      .unwrap()
      .then(res => {
        storeDataStorage('accessToken', res.login.accessToken);
        storeDataStorage('refreshToken', res.login.refreshToken);
        storeDataStorage('roles', res.login.roles);

        window.location.assign('/');
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <div>
      <button onClick={onClickLogin}>Login</button>
    </div>
  );
}
