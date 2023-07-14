import { useMotionValue } from "framer-motion";
import ProgressBar from "../components/ProgressBar";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import S3 from "aws-sdk/clients/s3";



export default function Upload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    return upload?.abort();
  }, []);

  useEffect(() => {
    progress.set(0);
    setUpload(null);
  }, [files]);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setFiles(e.target.files);
  };

  const handleUpload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const params = {
        Bucket: "darkduck",
        Key: file.name,
        Body: file,
      };
      console.log(params);

      try {
        const upload = s3.upload(params);
        setUpload(upload);
        upload.on("httpUploadProgress", (p) => {
          console.log(p.loaded / p.total);
          progress.set(p.loaded / p.total);
        });
        await upload.promise();
        console.log(`File uploaded successfully: ${file.name}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!upload) return;
    upload.abort();
    progress.set(0);
    setUpload(null);
  };
  return (
    <div className="dark flex min-h-screen w-full items-center justify-center">
      <main>
        <form className="flex flex-col gap-4 rounded bg-stone-800 p-10 text-white shadow">
          <input multiple type="file" onChange={handleFileChange} />
          <button
            className="rounded bg-green-500 p-2 shadow"
            onClick={handleUpload}
          >
            Upload
          </button>
          {upload && (
            <>
              <button
                className="rounded bg-red-500 p-2 shadow"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <ProgressBar value={progress} />
            </>
          )}
        </form>
      </main>
    </div>
  );
}
