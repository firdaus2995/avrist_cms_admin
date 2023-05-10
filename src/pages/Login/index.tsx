import { useLoginMutation } from '../../services/Login/loginApi';

export default function Login() {
  const [login] = useLoginMutation();
  const onClickLogin = () => {
    login({ username: 'super', password: 'Password09!' })
      .unwrap()
      .then(res => {
        localStorage.setItem('accessToken', res.login.accessToken);
        localStorage.setItem('refreshToken', res.login.refreshToken);
        localStorage.setItem('roles', JSON.stringify(res.login.roles));
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
