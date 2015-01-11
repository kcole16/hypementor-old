  $(document).ready(function() {
    console.log("Ready");
    var $container = $('.container');
    function showData(company) {
      $.container.html(Template.showSomething);
    };
    $('button').click( function() {
        var form = $('form').serialize();
        console.log(form);
        $.ajax({
            url: '/get_info',
            type: 'post',
            dataType: 'json',
            data: $('form').serialize(),
            // success: console.log("succes")
            // // failure: function(){
            // //     console.log("Nope");
            // // }
            success: function(data, status, xhttp){
              // showData();
            }
          });
     });
  });


// $(document).ready(function() {
//     var $container = $('.container');
//     // function youAreAgent() {
//     //     $container.html(Template.youAreAgent);
//     // }
//     function getTicket() {
//         $container.html(Template.getTicket);
//     }
    // function whatIf() {
    //     $container.html(Template.whatIf);
    // }
    // function forgotPassword() {
    //     $container.html(Template.forgotPassword);
    // }
    // function respondLikeThis() {
    //     $container.html(Template.respondLikeThis);
    // }
    // function clientSeesThis() {
    //     $container.html(Template.clientSeesThis);
    // }
    // // function nowYouCan() {
    // //     $container.html(Template.nowYouCan);
    // // }
    // function withUnbabelForZendesk() {
    //     $container.html(Template.withUnbabelForZendesk);
    // }
    // function nowMultilingual() {
    //     $container.html(Template.nowMultilingual);
    // }
    // var steps = [getTicket, whatIf, forgotPassword, respondLikeThis, 
    //              clientSeesThis, withUnbabelForZendesk, nowMultilingual];
    // var curStep = 0
    // ;
    // // youAreAgent();
    // getTicket();
    // function advance() {
    //     curStep += 1;
    //     if (curStep >= steps.length) {
    //         curStep = 0;
    //     }
    //     steps[curStep]();
    //     console.log(curStep);
    // }
    // var counter = 1;
    // var interval = setInterval(function(){
    //     if (counter < steps.length) {
    //         advance();
    //         counter += 1;
    //     } else {
    //         clearInterval(interval);
    //     }
    // }, 3000);

    // $('body').click(function() {
    //     if (steps[curStep] === whatIf || steps[curStep] === nowMultilingual) {
    //         $('button').click(function() {
    //             advance();
    //         });
    //     // } else if (steps[curStep] === nowMultilingual) {
    //     //     $('form').submit(function() {
    //     //         var url ='/'
    //     //         $.ajax({
    //     //            type: "GET",
    //     //            url: url,
    //     //            data: $("#idForm").serialize(), // serializes the form's elements.
    //     //            success: function(data)
    //     //            {
    //     //                alert(data); // show response from the php script.
    //     //            }
    //     //          });
    //     //     });
    //     } else {
    //         advance();
    //     }
    // });
// });
