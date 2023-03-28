import { uniqBy, differenceBy } from "lodash";
import { useEffect, useReducer } from "react";

export type FileUpload = File & {
  url?: string;
  uploadStatus?: "uploading" | "complete";
};

export default function useFileUpload() {
  const [files, dispatch] = useReducer(reduce, []);

  useEffect(() => {
    const toUpload = files.filter(f => !f.uploadStatus);

    if (toUpload.length > 0) {
      dispatch({ type: "start-upload", files: toUpload });

      // TODO: replace with actual call to upload files
      const fetchData = () =>
        new Promise((resolve: (response: { url: string }) => void) =>
          setTimeout(() => resolve({ url: "http://www.google.fr" }), 3000)
        );

      fetchData()
        .then(({ url }) => dispatch({ type: "complete-upload", files: toUpload, url }))
        .catch(e => {
          console.error(e);
          dispatch({ type: "remove", files: toUpload });
        });
    }
  }, [files]);

  return {
    files,
    upload: (files: File[]) => dispatch({ type: "upload", files }),
    remove: (files: File[]) => dispatch({ type: "remove", files }),
  };
}

type Action =
  | {
      type: "upload" | "remove" | "start-upload";
      files: File[];
    }
  | {
      type: "complete-upload";
      files: File[];
      url: string;
    };

function reduce(files: FileUpload[], action: Action): FileUpload[] {
  switch (action.type) {
    case "upload":
      return uniqBy([...files, ...action.files], "name");
    case "remove":
      return differenceBy(files, action.files, "name");
    case "start-upload":
      return files.map(f => ((f.uploadStatus = "uploading"), f));
    case "complete-upload":
      return files.map(f => (((f.uploadStatus = "complete"), (f.url = action.url)), f));
  }
}
