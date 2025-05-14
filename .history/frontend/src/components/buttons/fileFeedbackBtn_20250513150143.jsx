import Button from "../common/Button";

function RecordFeedbackBtn({onClick}) {
    return(
        <Button onClick={onClick} >
            음성 파일로 피드백 받기
        </Button>
    )
}

export default RecordFeedbackBtn;