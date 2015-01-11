function Template() {}

Template.showSomething = '\
    <h1>You are a customer service agent</h1>\
';

Template.showData = '\
    <div>\
        <h1>You are a customer service agent, and you get a ticket like this</h2><br>\
        <div class="ticket-container">\
             \u30d1 \u30b9 \u79c1<br/>  \u306f \u81ea \u5206 \u306e \u30d1 \u30b9 \u30ef \u30fc \u30c9 \u3092 \u5909 \u66f4 \u3059 \u308b<br/> \u5fc5 \u8981 \u304c \u3042 \u308a \u307e \u3059 <br/> \u5206 \u306e \u30d1 \u30b9 \
        </div>\
    </div>\
';


Template.whatIf = '\
    <h1>What if you could push one button</h1>\
    <button class="enable-translation">Enable Translation</button>\
';

Template.forgotPassword = '\
    <h1>see this</h1>\
    <div class="ticket-container">\
        I have forgotten my password, can I please reset it?\
    </div>\
';

Template.respondLikeThis = '\
    <h1>respond like this</h1>\
    <div class="ticket-container">\
        <div><b>#unbabel</b><br><br></div>\
        <div>Sure, no problem! Your new temporary password is HD82ND9R8. Please note it will expire in 24 hours.</div>\
        <div>\
            <br>Cheers,<br>\
            Samuel Hopkins<br>\
            Customer Support Specialist\
        </div>\
    </div>\
';

Template.clientSeesThis = '\
    <h1>and have your user see this</h1>\
    <div class="ticket-container">\
        <div>\u306f \u81ea \u5206 \u306e \u30d1 \u30b9 \u30ef HD82ND9R8 \u30fc \u30c9 \u3092 \u5909 \u66f4 \u3059 \u308b</div>\
        <div>\
            <br>\u66f4 \u3059,<br>\
            Samuel Hopkins<br>\
            \u5206 \u306e \u30d1\
        </div>\
    </div>\
';

Template.nowYouCan = '\
    <h1>Now you can</h1>\
';

Template.withUnbabelForZendesk = '\
    <h1>Unbabel for Zendesk allows you to</h1>\
    <div class="left-align">\
       <ul>\
           <li>Automatically translate incoming messages so you don\'t have to wait</li>\
           <li>Respond in your native language</li>\
           <li>Move on to your next ticket</li>\
       </ul>\
       <div>\
           Your response will be translated and delivered by Unbabel for Zendesk without requiring you to return to the ticket.\
       </div>\
   </div>\
';


Template.nowMultilingual = '\
   <h1>\
       You now provide multi-lingual support.\
   </h1>\
   <h2>\
       And your workflow didn\'t change.\
   </h2>\
   <div class="form-center">\
      <h3>Request a demo</h3>\
        </h3>\
    </div>\
';

/*
Template. = '\
';

Template. = '\
';
          <form id="idForm">\
            <label>Name: <input type="text" name="name"></input></label><br>\
            <br>\
            <label>Email: <input type="email" name="email"></input></label><br>\
            <br>\
            <label>Company: <input type="text" name="company"></input></label><br>\
            <br>\
            <button type="submit">Submit</button>\
          </form>\

Template. = '\
';

Template. = '\
';

Template. = '\
';
*/
