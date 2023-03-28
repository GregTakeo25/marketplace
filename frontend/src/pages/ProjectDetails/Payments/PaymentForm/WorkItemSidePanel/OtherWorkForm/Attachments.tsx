import { useRef } from "react";
import Button, { ButtonSize, ButtonType } from "src/components/Button";
import { useIntl } from "src/hooks/useIntl";
import Attachment2 from "src/icons/Attachment2";
import CheckLine from "src/icons/CheckLine";

type Props = {
  attachments: File[];
  setAttachments: (attachments: File[] | ((attachments: File[]) => File[])) => void;
};
export default function Attachments({ attachments, setAttachments }: Props) {
  const { T } = useIntl();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-4 px-4 py-3 rounded-lg border border-greyscale-50/12">
      <div className="flex flex-row justify-between items-center font-belwe font-normal text-base text-greyscale-50">
        {T("payment.form.workItems.other.attachments.title")}
        <Button type={ButtonType.Secondary} size={ButtonSize.Sm} onClick={() => fileInputRef?.current?.click()}>
          <Attachment2 />
          {T("payment.form.workItems.other.attachments.addButton")}
        </Button>
        <input
          type="file"
          id="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={({ target }) => setAttachments(attachments => [...attachments, ...Array.from(target.files || [])])}
        />
      </div>
      <div className="flex flex-col gap-3">
        {attachments.map((attachment, index) => (
          <div key={index} className="flex flex-row items-center gap-3 border border-greyscale-50/8 rounded-lg p-4">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl">
              <Attachment2 className="text-greyscale-50 text-xl" />
            </div>
            <div className="font-walsheim font-medium text-greyscale-50 text-base w-full">{attachment.name}</div>
            <CheckLine className="text-greyscale-50 text-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
