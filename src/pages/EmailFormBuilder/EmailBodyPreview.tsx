import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import IconEdit from "@/assets/edit-purple.svg";
import { LabelText } from "@/components/atoms/Label/Text";
import { TitleCard } from "@/components/molecules/Cards/TitleCard";
import { getCredential } from "@/utils/Credential";
import { useGetEmailBodyDetailQuery } from "@/services/EmailFormBuilder/emailFormBuilderApi";

export default function EmailBodyPreview() {
  const params = useParams();

  // PERMISSION STATE
  const [id] = useState<number>(Number(params.id));
  const [canEditEmailFormBuilder, setCanEditEmailFormBuilder] = useState(false);
  // FORM STATE
  const [value, setValue] = useState<any>([]);
  const [emailBodyDetail, setEmailBodyDetail] = useState<any>({});

  // RTK GET DETAIL
  const fetchEmailBodyDetail = useGetEmailBodyDetailQuery({id}, {
    refetchOnMountOrArgChange: true,
  });
  const { data } = fetchEmailBodyDetail;

  useEffect(() => {
    if (data) {
      setEmailBodyDetail({
        title: data?.getDetail?.title,
        shortDesc: data?.getDetail?.shortDesc,
      })
      setValue(data?.getDetail?.value);
    };
  }, [data]);

  useEffect(() => {
    getCredential().roles.forEach((element: any) => {
      if (element === "EMAIL_FORM_EDIT") {
        setCanEditEmailFormBuilder(true);
      };
    });
  }, []);

  return (
    <TitleCard
      title={emailBodyDetail?.title ?? ""}
      topMargin="mt-2"
      TopSideButtons={
        canEditEmailFormBuilder ? (
          <Link to={`/email-form-builder/edit-body/${id}`} className="btn btn-outline btn-primary flex flex-row gap-2 rounded-xl">
            <img src={IconEdit} className="w-[24px] h-[24px]" />
            <span>Edit Email Body</span>
          </Link>
        ) : (
          <></>
        )
      }
    >
      <form className="flex flex-col gap-5">
        <LabelText 
          labelTitle="Title"
          labelWidth={200}
          labelRequired
          value={emailBodyDetail?.title}
        />
        <LabelText 
          labelTitle="Short Description"
          labelWidth={200}
          labelRequired
          value={emailBodyDetail?.title}
        />
        <LabelText 
          labelTitle="Value"
          labelWidth={200}
          labelRequired
          value={value}
        />
        <div className="mt-[10%]">

        </div>
      </form>
    </TitleCard>
  )
};
