// Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyAldJrR8jENWwMP0jYrHf2kvT92P6aYv7M",
  authDomain: "train-awl.firebaseapp.com",
  databaseURL: "https://train-awl.firebaseio.com",
  projectId: "train-awl",
  storageBucket: "",
  messagingSenderId: "51393396868",
  appId: "1:51393396868:web:c2c545709f249bdf1c82d1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var trainData = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
    // Prevent the default form submit behavior
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var station = $("#station-input").val().trim();
    var distance = $("#distance-input").val().trim();
    var interval = $("#interval-input").val().trim();
    var delay = $("#delay-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      station: station,
      distance: distance,
      interval: interval,
      delay: delay,
    };
  
    // Uploads train data to the database
    trainData.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
    console.log(newTrain.station);
    console.log(newTrain.distance);
    console.log(newTrain.interval);
    console.log(newTrain.delay);

    console.log("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
    $("#station-input").val("");
    $("#distance-input").val("");
    $("#interval-input").val("");
    $("#delay-input").val("");

}); // end add-train-btn click
  
// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
    var tStation = childSnapshot.val().station;
    var tDistance = childSnapshot.val().distance;
    var tInterval = childSnapshot.val().interval;
    var tDelay = childSnapshot.val().delay;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var trainTime = moment(tFirstTrain, "HH:mm").subtract(1, "years");
    console.log("trainTime 2: " + trainTime);

    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
  
    // If the first train is later than the current time, set arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add tMinutes to the current time
        tArrival = moment()
          .add(tMinutes, "m")
          .format("hh:mm A");
    } // end else

    var normalSpeed = 0;
    var delaySpeed = 0;
    var tSpeedChange = 0;
    var tSpeedPercentText = "";

    // Compute speed change
    if (tDelay > 0) {
    normalSpeed = (tDistance / tInterval);
    delaySpeed = (tDistance / (tInterval - tDelay));
    tSpeedChange = ( delaySpeed - normalSpeed ) / delaySpeed;
    tSpeedPercent = Math.round(tSpeedChange * 100) / 100;
    tSpeedPercentText = "+" + (tSpeedPercent * 100) + "%";
    } // end if
  
    // Add each train's data into the table
    // $("#train-table > tbody").append(
      $("#train-table tbody").append(
        $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes),
        $("<td>").text(tStation),
        $("<td>").text(tDistance),
        $("<td>").text(tInterval),
        $("<td>").text(tDelay),
        $("<td>").text(tSpeedPercentText),
      ) // end append
    ); // end child-added function
  }); // end child-added
  