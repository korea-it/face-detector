const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)



function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
const Emotions = {
  angry: "화난 표정입니다.",
  disgusted: "메스꺼운 표정입니다.",
  fearful: "겁먹은 표정입니다.",
  happy: "행복한 표정입니다.",
  neutral: "무표정입니다.",
  sad: "슬픈 표정입니다.",
  surprised: "놀란 표정입니다."
};
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  let max = 0;
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)



    if (resizedDetections[0]) {
      const expressions = resizedDetections[0].expressions;
      const state = Object.entries(expressions).reduce((acc, cur) => {
        return acc[1] > cur[1] ? acc : cur;
      });
      const h2 = document.getElementById('state');
      h2.innerText = `당신은 ${Emotions[state[0]]}`;
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})