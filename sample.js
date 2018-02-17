/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Sample transaction processor function.
 * @param {org.acme.sample.SendMessage} tx The send message instance.
 * @transaction
 */
function sendMessage(tx) {
  var NS = 'org.acme.sample';
  
  if (tx.value.length <= 0) {
    throw new Error('WHAT ARE YOU SAYING!?');
  }
  
  //first check if transaction user is a registered user
  return getParticipantRegistry('org.acme.sample.User')
  .then(function (participantRegistry) {
    // Determine if the specific user exists in the participant registry.
    return participantRegistry.exists(tx.chatUser.facebookId);
  })
  .then(function (exists) {
    
    if (exists) {
        console.log('User exists');
      var messageId = Math.random().toString(36).substring(3);
      
      var message = getFactory().newResource(NS,
       'Message', messageId);

      message.value = tx.value;
      message.chatUser = tx.chatUser;
      message.messageId = messageId;
      if(!message.chatUser.messages) {
        message.chatUser.messages = [];
      }
      //add messageId to array of messages for a user
      message.chatUser.messages.push(messageId);
      
      
      return getAssetRegistry('org.acme.sample.Message')
        .then(function(messageAssetRegistry){
          return messageAssetRegistry.add(message);
        }).then(function(){
      		return getParticipantRegistry('org.acme.sample.User')
            .then(function (participantRegistry) {
              return participantRegistry.update(tx.chatUser);
            })
      	})
     
   



      // .then(function(){
      //   return getAssetRegistry('org.acme.sample.Message')
      //     .then(function(messageAssetRegistry){
      //       return messageAssetRegistry.add(message);
      //     })
      // })
      // .then(function(){
      //   return getAssetRegistry('org.acme.sample.Message')        
      //   .then(function(messageAssetRegistry){
      //     return messageAssetRegistry.update(message);
      //   });
      // });
      
    } else {
    	throw new Error('Shit! HES AN IMPOSTOR!');
    }
  })
}
/**
 * Sample transaction processor function.
 * @param {org.acme.sample.getUserMessages} facebookId The Id of the user that we want to get messages from.
 * @transaction
 */
function getUserMessages(userId) {
  
  
  
}