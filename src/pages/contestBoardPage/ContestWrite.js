import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {Button, Form, Spinner} from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import "./ContestWrite.css";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import editor from "draft-js/lib/ContentBlock";


function ContestWrite(){
    const Authorization = localStorage.getItem("Authorization");
    const [image, setImage] = useState({
        image_file: '',
        preview_URL: "/images/eye.png"
        });
    const [loaded, setLoaded] = useState(false);
    let inputRef;

    const [contestBoard, setContestBoard] = useState({
        image: '',
        host: '',
        supervision: '',
        sponsor: '',
        homepage: '',
        prize:'',
        duration_start: '',
        duration_end: '',
        title: '',
        content: '',
    });
    const [data , setData] = useState({
        content:''
    })

    const saveImage = (e) =>{
        e.preventDefault();
        const fileReader = new FileReader();

        if(e.target.files[0]){
            setLoaded("loading")
            fileReader.readAsDataURL(e.target.files[0])
        }
        fileReader.onload = () => {
            setImage(
                {
                    image_file: e.target.files[0],
                    preview_URL: fileReader.result
                }
            )
            setLoaded(true);
        }
    }

    const changeValue = (e) => {
        console.log(e.target.value);
        console.log(e.target.name);
        setContestBoard({
            ...contestBoard,
            [e.target.name]: e.target.value,
        });
    };

    const SopSummit = async (e) => {
        e.preventDefault();
        const FrontName = moment().format('YYYYMMDDHHmmss');
        const BackName = image.image_file.name;
        const imageName = FrontName + BackName;
        console.log(contestBoard);


        if(image.image_file){
            console.log(image.image_file);
            const formData = new FormData()
            formData.append('multipartFiles', image.image_file);
            formData.append('imageName', imageName);
            await axios.post('http://localhost:8000/uploadImage', formData);
            setImage({
                image_file: "",
                preview_URL: "img/default_image.png",
            });
            setLoaded(false);
        }
        else {
            alert("????????? ???????????????!");
            return;
        }

        contestBoard.image = imageName;
        contestBoard.content = data.content;
        console.log(contestBoard);

        fetch("http://localhost:8000/contestBoard/contestBoardWrite",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8', Authorization
                },
                body: JSON.stringify(contestBoard)
            })
            .then(()=>{
                alert("????????? ??????");
                window.location.href = "/contestboard";
            })
            .then()
    }


    return(
        <>
            <div className="writeWrite">

                <div className="uploader-wrapper">
                    <input type="file" accept="image/*"
                           onChange={saveImage}
                           ref={refParam => inputRef = refParam}
                           style={{ display: "none" }}
                    />
                    <div className="contestCoverWrapper">
                        {loaded === false || loaded === true ? (
                            <img src={image.preview_URL} alt="????????? ??????" className="posterCover"/>
                        ) : (
                            <Spinner className="img-spinner" tip = "????????? ???????????????"/>
                        )}
                    </div>
                    <div className="upload-button">
                        <button className="posterIn" type="primary" onClick={() => inputRef.click()}>
                            ????????????
                        </button>
                        <button className="posterOut" type="primary" danger>       {/*onclick*/}
                            ????????????
                        </button>
                    </div>
                </div>

                <Form onSubmit={SopSummit}>
                    <div className="contestWriteWrapper">
                        <div className="inDurationContainer">
                            <div className="inDurationTitle">
                                ????????????
                            </div>
                            <div className="inDurationContent">
                                <textarea onChange={changeValue} name="duration_start" className="duration_start" placeholder="ex)20XX.XX.XX" />
                                <div className="m">~</div>
                                <textarea onChange={changeValue} name="duration_end" className="duration_end" placeholder="ex)20XX.XX.XX"  />
                            </div>
                        </div>
                        <div className="inHostContainer">
                            <div className="inHostTitle">
                                ??????
                            </div>
                            <div className="inHostContent">
                                <textarea onChange={changeValue} name="host" className="host" placeholder="???????????????"  />
                            </div>
                        </div>
                        <div className="inSupervisionContainer">
                            <div className="inSupervisionTitle">
                                ??????
                            </div>
                            <div className="inSupervisionContent">
                                <textarea onChange={changeValue} name="supervision" className="supervision" placeholder="???????????????"  />
                            </div>
                        </div>
                        <div className="inSponsorContainer">
                            <div className="inSponsorTitle">
                                ??????/??????
                            </div>
                            <div className="inSponsorContent">
                                <textarea onChange={changeValue} name="sponsor" className="sponsor" placeholder="??????/?????? ?????????"  />
                            </div>
                        </div>
                        <div className="inPrizeContainer">
                            <div className="inPrizeTitle">
                                ??????
                            </div>
                            <div className="inPrizeContent">
                                <textarea onChange={changeValue} name="prize" className="prize" placeholder="?????????(??????)"  />
                            </div>
                        </div>
                        <div className="inHomepageContainer">
                            <div className="inHomepageTitle">
                                ????????????
                            </div>
                            <div className="inHomepageContent">
                                <textarea onChange={changeValue} name="homepage" className="homepageUrl" placeholder="???????????? (https:// ??????)"  />
                            </div>
                        </div>
                    </div>
                    <textarea onChange={changeValue} name="title" className="contestWriteTitle" placeholder="??????" />
                    <div className="outline">
                        <CKEditor
                            editor={ ClassicEditor }
                            data="  <h4>1.????????????</h4>
                                    <br /><br />
                                    <h4>2.????????????</h4>
                                    <br /><br />
                                    <h4>3.????????????</h4>
                                    <br /><br />
                                    <h4>4.????????????</h4>
                                    <br /><br />
                                    "
                            placeholder= 'Type the content here!'
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setData({
                                    content: data,
                                });
                                console.log( { event, editor, data } );
                            } }
                            onBlur={ ( event, editor ) => {
                                console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                            } }
                        />
                    </div>
                    <button type="submit" className="contestIn">????????????</button>
                </Form>
            </div>
        </>
    )
}

export default ContestWrite;