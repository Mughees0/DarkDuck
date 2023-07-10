"use client";
import { StorageRes } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, {
  ChangeEventHandler,
  FormEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiFillCloseCircle } from "@react-icons/all-files/ai/AiFillCloseCircle";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

const ImageUploader = ({
  setUpdateImage,
  updateImage,
  profileModal,
  setProfileModal,
}) => {
  // 1. add reference to input element
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { data: Session } = useSession();
  const [currentFile, setCurrentFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);

  useEffect(() => {
    return upload?.abort();
  }, []);

  useEffect(() => {
    setUpload(null);
  }, [file]);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setFile(e.target.files![0]);
  };

  const selectFile = (event) => {
    setCurrentFile(event.target.files);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleImageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    let imgName: string = "";
    // 1. Store Audio Data In Mongo Blob
    try {
      // 3. build form data
      const params = {
        Bucket: "darkduck",
        Key: file.name,
        Body: file,
      };
      console.log("====================================");
      console.log(file.name);
      imgName = file.name;
      console.log("====================================");
      try {
        const upload = s3.upload(params);
        setUpload(upload);
        await upload.promise();
      } catch (err) {
        console.error(err);
      }

      if (!file) return;
    } catch (error) {
      if (error) {
        console.log(
          "profile Image not uploaded." +
            " The error message:> " +
            error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
    // 2. Use the FileName and store the Post Data in MongoDB
    try {
      const req = await axios.post(
        "/api/v1/users/upload/profile_img",
        {
          id: Session?.user?.id,
          profilePicture: imgName,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (req.status === 200) {
        setUpdateImage(!updateImage);
        setProfileModal(!profileModal);
      }
      const res = await req.data;
    } catch (error) {
      if (error.response.status === 400) {
        console.log(
          "Profile Image is uploaded but profile did not update." +
            " The error message:> " +
            error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
    setUploading(false);
  };

  return (
    <div className="fixed z-10 top-0 w-full h-full flex bg-black bg-opacity-60">
      <div className="extraOutline p-2 bg-white w-[90%] sm:w-max bg-whtie m-auto rounded-lg flex justify-end flex-col dark:bg-gray-600 dark:text-gray-50">
        <AiFillCloseCircle
          onClick={() => setProfileModal(!profileModal)}
          className=" self-end justify-self-start mb-2 dark:bg-transparent"
        />
        <div className="file_upload p-5 mb-2 relative border-4 border-dotted border-gray-300 rounded-lg w-full sm:w-[450px]">
          <form
            onSubmit={handleImageSubmit}
            className=" h-80 w-full flex justify-center items-center flex-col"
          >
            <label htmlFor="picture" className="btn btn-default  p-0">
              <input
                id="picture"
                type="file"
                name="files"
                accept="image/*"
                ref={ref}
                onChange={(e) => {
                  selectFile(e);
                  handleFileChange(e);
                }}
                className=" w-full my-5 border border-gray-300 rounded-r-md flex items-center justify-between"
              />
            </label>
            {previewImage && (
              <img className=" w-60" src={previewImage} alt="" />
            )}
            <input
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 my-2 ml-3 dark:text-gray-50"
              disabled={!currentFile}
              type="submit"
              value={uploading ? "Please Wait..." : "Change Profile Image"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
