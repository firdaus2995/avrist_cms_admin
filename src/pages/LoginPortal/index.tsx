import Logo from '../../assets/Avrist-logo.png';
import Portal1 from '../../assets/login/portal-1.png';
import Portal2 from '../../assets/login/portal-2.png';
import Portal3 from '../../assets/login/portal-3.png';
import Typography from '../../components/atoms/Typography';

const Header = () => {
  return (
    <div className="navbar bg-base-100 justify-center">
      <div className="navbar-center">
        <img src={Logo} className="scale-50" />
      </div>
    </div>
  );
};

const LoginPortal = () => {
  const cards = [
    { id: 1, title: 'Avrist Life Insurance', img: Portal1 },
    { id: 2, title: 'Avrist General Insurance', img: Portal2 },
    { id: 3, title: 'Avrist Asset Management', img: Portal3 },
  ];

  return (
    <div className=" bg-light-purple-2">
      <Header />
      <Typography className="my-20 text-center text-dark-purple" type="heading" weight="bold">
        Avrist Content Management System
      </Typography>
      <div className="flex flex-wrap justify-center h-screen">
        {cards.map(item => (
          <div
            key={item.id}
            className="bg-white p-4 shadow-md rounded-2xl w-64 h-64 mx-4 my-4 cursor-pointer">
            <div className="aspect-w-1 aspect-h-1">
              <div className="w-full h-full">
                <img
                  className="object-cover object-center w-full h-full rounded-2xl"
                  src={item.img}
                  alt={item.title}
                />
              </div>
            </div>
            <div className="p-4">
              <Typography
                className="text-center text-dark-purple"
                type="body"
                size="m"
                weight="medium">
                {item.title}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPortal;
