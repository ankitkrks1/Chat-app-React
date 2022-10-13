import React, {useState} from "react";

const Fileshare = ({uri}) => {
  const [loading,setLoading] = useState('')

  const handleFile = (e)=>{
    const reader = new FileReader()

    reader.onload = (e)=>{ // trigges when loading file completed.
        uri(e.target.result)
    }
    reader.onprogress = (e)=>{ // this will check loading status
        if(e.lengthComputable){
            const load = Math.round(e.loaded*100/e.total)
            setLoading(load)
        }
    }
    reader.readAsDataURL(e.target.files[0])
  }
  
  return (
    <div>
      <input className="fileshare" type="file" onChange={handleFile} />
      {loading !== '' && <p>File :- {loading}% Loaded</p>}
 
    </div>
  );
};

export default Fileshare;
