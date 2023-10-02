import React, { useEffect, useState } from "react";
import AvatarNoImage from "../../../assets/avatar-noimage.svg";
import AvatarIconEdit from "../../../assets/avatar-icon-edit.svg";
import AvatarIconPlus from "../../../assets/avatar-icon-plus.svg";
import { getCredential } from "@/utils/Credential";
import { useAppDispatch } from "@/store";
import { openToast } from "@/components/atoms/Toast/slice";
import { formatFilename } from "@/utils/logicHelper";

interface IFileUploaderAvatar {
  id?: any,
  image: any,
  imageChanged: any,
};

const FileUploaderAvatar: React.FC<IFileUploaderAvatar> = ({
  id,
  image,
  imageChanged,
}) => {
  const dispatch = useAppDispatch();
  const [imgUrl, setImgUrl] = useState<any>("");

  useEffect(() => {
    if (image) {
      setImgUrl(`${import.meta.env.VITE_API_URL}/files/get/${image}`);
    } else {
      setImgUrl("");
    }
  }, [image]);

  const handleUpload = async (event: any) => {
    const token = getCredential().accessToken;
    const body = new FormData();
    const fileName = formatFilename(event.target.files[0].name);

    const maxFileSize = 5 * 1024 * 1024; // 5MB dalam bytes

    if (event.target.files[0].size > maxFileSize) {
      dispatch(
        openToast({
          type: 'error',
          title: 'File Size Too Large',
          message: 'Please upload a file that is no larger than 5MB.',
        }),
      );
      return;
    };

    body.append('file', event.target.files[0]);
    body.append('fileType', 'IMAGE');
    body.append('fileName', fileName);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/upload`, {
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        imageChanged(responseData.data);
      } else {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed Upload',
          }),
        );
      };
    } catch (error) {
      dispatch(
        openToast({
          type: 'error',
          title: 'Upload Error',
        }),
      );
    };
  };

  return (
    <label
      htmlFor={id ?? "upload_avatar"}
    >
      <div className="w-[115px] h-[115px] relative border-1 border-[#DBDBDB] rounded-full flex justify-center items-center bg-lavender">
        <img 
          className={imgUrl !== "" ? 'w-full h-full rounded-full object-cover' : ''}
          src={imgUrl !== "" ? imgUrl : AvatarNoImage}
        />
        <div className='w-[50px] h-[50px] absolute bottom-0	right-[-10px] bg-white rounded-full flex justify-center items-center'>
          <img
            src={imgUrl !== "" ? AvatarIconEdit : AvatarIconPlus}
          />
        </div>
      </div>
      <input
        id={id ?? "upload_avatar"}
        type="file"
        className="hidden"
        onChange={handleUpload}
      />
    </label>
  )
};

export default FileUploaderAvatar;
