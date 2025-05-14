import Button from "../common/Button";

function RecordFeedbackBtn({onClick}) {
    return(
        <Button onClick={onClick} >
             녹음해서 피드백 받기
        </Button>
    )
}

export default RecordFeedbackBtn;