
// 6. Set up final destination.
// 7. Set distance and anticipated arrival time.
// 8. Calculate average speed between stations to arrive on time.
// 9. Add a station delay in minutes.
//10. Calculate the (increase in) speed required to get there on time.


// Initialize Firebase
  // Your web app's Firebase configuration
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

    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    // Uploads train data to the database
    trainData.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    console.log("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
    trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;

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
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }

    console.log("trainTime:",trainTime);
    console.log("maxMoment:",maxMoment);
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    // Add each train's data into the table
    // $("#train-table > tbody").append(
        $("#train-table tbody").append(
        $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });
  
  // Assume the following situations.
  
  // (TEST 1)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 3 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? ( Let's use our brains first)
  // It would be 3:18 -- 2 minutes away
  
  // (TEST 2)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 7 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? (Let's use our brains first)
  // It would be 3:21 -- 5 minutes away
  
  // ==========================================================
  
  // Solved Mathematically
  // Test case 1:
  // 16 - 00 = 16
  // 16 % 3 = 1 (Modulus is the remainder)
  // 3 - 1 = 2 minutes away
  // 2 + 3:16 = 3:18
  
  // Solved Mathematically
  // Test case 2:
  // 16 - 00 = 16
  // 16 % 7 = 2 (Modulus is the remainder)
  // 7 - 2 = 5 minutes away
  // 5 + 3:16 = 3:21
  