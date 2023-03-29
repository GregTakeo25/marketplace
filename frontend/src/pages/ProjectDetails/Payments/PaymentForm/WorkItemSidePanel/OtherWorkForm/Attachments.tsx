import classNames from "classnames";
import { useRef } from "react";
import Loader from "src/assets/icons/Loader";
import Button, { ButtonSize, ButtonType } from "src/components/Button";
import { useIntl } from "src/hooks/useIntl";
import Attachment2 from "src/icons/Attachment2";
import CheckLine from "src/icons/CheckLine";
import Subtract from "src/icons/SubtractLine";
import { FileUpload } from "./useFileUpload";

type Props = {
  attachments: FileUpload[];
  upload: (attachments: File[]) => void;
  remove: (attachments: File[]) => void;
};
export default function Attachments({ attachments, upload, remove }: Props) {
  const { T } = useIntl();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col px-4 py-3 gap-4 rounded-lg border border-greyscale-50/12">
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
          onChange={({ target }) => target.files && upload(Array.from(target.files))}
        />
      </div>
      {attachments.length > 0 && (
        <div
          className={classNames(
            "flex flex-col gap-3 -mr-3 pr-3",
            "max-h-96 overflow-auto scrollbar-thin scrollbar-w-1.5 scrollbar-thumb-spaceBlue-500 scrollbar-thumb-rounded"
          )}
        >
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="group/attachment flex flex-row items-center gap-3 border border-greyscale-50/8 rounded-lg p-4"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl shrink-0">
                <Attachment2 className="text-greyscale-50 text-xl" />
              </div>
              <div className="font-walsheim font-medium text-greyscale-50 text-base w-full">{attachment.name}</div>
              {attachment.url ? (
                <>
                  <div className="group-hover/attachment:opacity-100 opacity-0">
                    <Button
                      type={ButtonType.Secondary}
                      size={ButtonSize.Sm}
                      iconOnly
                      onClick={() => remove([attachment])}
                    >
                      <Subtract />
                    </Button>
                  </div>
                  <CheckLine className="text-greyscale-50 text-xl group-hover/attachment:hidden" />
                </>
              ) : (
                <Loader className="animate-spin" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
