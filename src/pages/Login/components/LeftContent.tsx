import LoginIllustrator from '@/assets/login/login-illustrator.svg';
import BottomAccessories from '@/assets/login/bottom-accessories.svg';
import IconContainer from '@/assets/login/icon-container.svg';
import { useEffect, useState } from 'react';
import { useGetCmsEntityLogoQuery } from '@/services/Config/configApi';

export const LeftContent = () => {
  const [logo, setLogo] = useState("");
  const fetchLogoQuery = useGetCmsEntityLogoQuery({});
  const { data: dataLogo } = fetchLogoQuery;

  useEffect(() => {
    if (dataLogo?.getConfig) {
      setLogo(dataLogo?.getConfig?.value);
    };
  }, [dataLogo])

  return (
    <div className="relative overflow-hidden md:flex w-1/2 bg-light-purple-2 i justify-around items-center hidden">
      <div>
        <img src={LoginIllustrator} />
      </div>
      <div className="absolute -bottom-0 -right-0">
        <img src={BottomAccessories} />
      </div>
      <div className="absolute -top-0 -left-0 z-1">
        <img src={IconContainer} />
        <div className="absolute top-8 left-8 z-2">
          <img src={logo} />
        </div>
      </div>
    </div>
  );
};
