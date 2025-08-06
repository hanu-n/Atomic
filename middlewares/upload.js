import multer from "multer";
import path from 'path'

const storage =multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'/uploads')
    },
    filename:(req,file,cb)=>{
        const uniqueName=Date.now()+ '-'+file.originalname
        cb(null,uniqueName)
    }
})

const upload=multer({
    storage,
    limits:{fileSize:10*1024*1024}
})

export default upload