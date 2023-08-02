import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import HeaderBg from "../../assets/home/header-bg.png";
import content1 from "../../assets/home/content-1.png";
import content2 from "../../assets/home/content-2.png";
import content3 from "../../assets/home/content-3.png";
import { Link, To } from 'react-router-dom';
import { useGetUserGuideQuery } from '@/services/Config/configApi';
import { store } from '@/store';

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const fetchUserGuideQuery = useGetUserGuideQuery({});
  const roles = store.getState().loginSlice.roles;
  const { data: userGuide } = fetchUserGuideQuery;

  useEffect(() => {
    if (userGuide?.getConfig) {
      setUrl(userGuide?.getConfig?.value);
    };
  }, [userGuide])

  const data = [
    {
      title: 'Regist Page Template',
      subtitle: 'Regist your new page template for Avrist Website',
      btnText: 'Page Template',
      path: '/page-template',
      image: content1,
    },
    {
      title: 'Add Content',
      subtitle: 'Dive into the editor and start creating content',
      btnText: 'Content Manager',
      path: '/content-manager',
      image: content2,
    },
    {
      title: 'Build Your Website Structure',
      subtitle: 'Choose any content type to build your website',
      btnText: 'Content Type Builder',
      path: '/content-type',
      image: content3,
    }
  ]

  const contentContainer = (data: {
    path: To; image: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; subtitle: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; btnText: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; 
}) => {
    return (
      <div className='w-full flex flex-row xl:h-[35vh] lg:h-[20vh] rounded-xl shadow-md mt-5 bg-white'>
        <div className='flex w-1/3 p-10'>
          <img className='w-full' src={data.image} />
        </div>
        <div className='flex w-2/3 xl:p-5 lg:p-0 bg-white rounded-xl'>
          <div className='w-full py-4 flex flex-col'>
            <p className='xl:text-xl lg:text-md font-bold'>
              {data.title}
            </p>
            <p className='xl:text-lg lg:text-sm font-medium'>
              {data.subtitle}
            </p>
            <Link to={data.path}>
              <button
                className="btn btn-md btn-outline btn-primary w-[75%] items-center justify-center flex gap-2 xl:mt-10 lg:mt-2">
                {data.btnText}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>

              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {roles?.includes('HOME_READ') && (
        <div className='w-full h-full flex flex-col'>
          <div className='w-full flex flex-row h-[40vh] rounded-xl shadow-md'>
            <div className='flex w-1/2 p-10 bg-white rounded-l-xl'>
              <div className='w-full py-4 flex flex-col'>
                <p className='text-3xl font-bold text-dark-purple'>
                  Welcome to
                </p>
                <p className='text-2xl font-medium text-dark-purple'>
                  Avrist Content Management System
                </p>
                <Link to={url} target='_blank'>
                  <button
                    className="btn btn-md bg-dark-purple xl:w-[40%] lg:w-[50%] items-center justify-center flex gap-2 mt-10">
                    Download User Guide
                  </button>
                </Link>
              </div>
            </div>
            <div className='flex w-1/2'>
              <img className='w-full rounded-r-xl' src={HeaderBg} />
              <div className="w-44 h-[40vh] bg-white rounded-full rounded-l-none absolute"></div>
            </div>
          </div>

          <div className='p-5 text-2xl font-bold border-b-2 mt-10'>
            Start Creating Content
          </div>
          <div className="grid grid-cols-2 gap-4 p-7">
            {data.map((val, idx) => (
              idx === 2 ? (
                <div key={idx} className="col-span-2 ...">
                  {contentContainer(val)}
                </div>
              ) : (
                <>
                  {contentContainer(val)}
                </>
              )
            ))}
          </div>
        </div>
      )}
    </>
  );
}
