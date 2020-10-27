var chat_data = {}, user_uuid, user_image, chatHTML = '', chat_uuid = "", userList = [];
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		    user_uuid = user.uid;
			getUsers();		   
		  } else {
		    console.log("Not sign in");
		  }
		});

		function logout(){			
			$.ajax({
				url : 'process.php',
				method : 'POST',
				data : {logoutUser:1},
				success : function(response){
					console.log(response);
					firebase.auth().signOut().then(function() {
					  console.log('Logout');

					  window.location.href = "index.php";

					}).catch(function(error) {
					  // An error happened.
					  console.log('Logout Fail');
					});
				}
			});
			
		
		}

		function getUsers(){
			$.ajax({
				url : 'process.php',
				method : 'POST',
				data : {getUsers:1},
				success : function(response){
					var login_user = firebase.auth().currentUser;					
					var resp = JSON.parse(response);
					if(resp.status == 200){
						var users = resp.message.users;
						var usersHTML = '';
						var messageCount = '';
						$.each(users, function(index, value){
								let image_class = "user-image";
								let image ='';
								let image_url = "http://localhost/chat_messanger/";
								if(value.image){
									image_class = '';
									image = '<img src="'+image_url+'images/'+value.image+'" width="50px" height="50px" />';
								}																				
							if (user_uuid != value.uuid) {
								get_user_count(user_uuid,value.uuid);
								let status_class ='';
								let login_status = '<span class="last_'+value.uuid+'"></span>'
								if(value.status=='1'){
									status_class = 'active';
								}
								if(value.last_login!=null && value.status=='0'){
									login_status = '<span class="last_'+value.uuid+'">'+value.last_login+'</span>'
								}
														
								usersHTML += '<div class="user '+status_class+'" id="'+value.uuid+'" uuid="'+value.uuid+'">'+
											'<div id="'+value.uuid+'" class='+image_class+'>'+image+'</div>'+
											'<div class="user-details '+value.uuid+'">'+
												'<div class="status"></div>'+
												'<h3><strong>'+ value.fullname+'<span class="count_'+value.uuid+'"></span></strong></h3>'+
												login_status+
											'</div>'+
										'</div>';
							
								userList.push({user_uuid: value.uuid, username: value.username});
							}else{
								user_image = image;	
							}
						//});						
					});
						$(".users").html(usersHTML);

					}else{
						console.log(response.message);
					}
				}
			});
		}

		function get_user_count(user_1, user_2){
			$.ajax({
				url : 'process.php',
				method : 'POST',
				data : {connectUser:1, user_1:user_1, user_2: user_2},
				success : function(resposne){
					var resp = JSON.parse(resposne);
					chat_data = {
						chat_uuid : resp.message.chat_uuid,
						user_1_uuid : resp.message.user_1_uuid,
						user_2_uuid : resp.message.user_2_uuid,
						user_1_name : '',
						user_2_name : name
					};
					db.collection('chat').where('chat_uuid', '==', chat_data.chat_uuid)
					.orderBy("time")
					.get().then(function(querySnapshot){
						let count = 0;
						let order = 0;
						querySnapshot.forEach(function(doc){
							chatHTML = '';
							if(doc.data().user_1_uuid != user_1 &&  doc.data().user_2_isView == 0) {
								count++;
								
							}else{
								order++;
							}
						});
						$(".count_"+user_2+"").removeClass("badge");
						if(count > 0){
							$(".count_"+user_2+"").addClass("badge");
							$(".count_"+user_2+"").html(count);
						}else{
							$(".count_"+user_2+"").removeClass("badge");
							$(".count_"+user_2+"").text('');
						}
					});
				}
			});
		}	

		

		$(document.body).on('click', '.user', function(){
			$('.write-message').css("display", "block");			
			var name = $(this).find("strong").text();
			var user_1 = user_uuid;
			var user_2 = $(this).attr('uuid');
			var imgTag =  $('#'+user_2).find('img').attr("src");
			//alert(user_image);
			//alert(imgTag);
			$('.message-container').html('Connecting...!');
			$(".name").text(name);
			$('.count_'+user_2).html('');
			$('.count_'+user_2).removeClass('badge');

			$.ajax({
				url : 'process.php',
				method : 'POST',
				data : {connectUser:1, user_1:user_1, user_2: user_2},
				success : function(resposne){
					var resp = JSON.parse(resposne);
					chat_data = {
						chat_uuid : resp.message.chat_uuid,
						user_1_uuid : resp.message.user_1_uuid,
						user_2_uuid : resp.message.user_2_uuid,
						user_1_name : '',
						user_2_name : name
					};
					$('.message-container').html('Say Hi to '+name);
					db.collection('chat').where('chat_uuid', '==', chat_data.chat_uuid)
					.orderBy("time")
					.get().then(function(querySnapshot){
						chatHTML = '';
						let previous_date='';
						querySnapshot.forEach(function(doc){														
								let unix_timestamp = doc.data().time.seconds;
								let date = new Date(unix_timestamp * 1000);
								let yy = date.getFullYear();
								let mm = date.getMonth()+1;
								let dd = date.getDate();
								let hours = date.getHours();
								let minutes = "0" + date.getMinutes();
								//let formattedTime = dd + '/' + mm + '/' + yy +' '+ hours + ':' + minutes.substr(-2);	
								let formattedTime = date.toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'}) //output: "May 21, 2019"
								//let formattedTime = hours + ':' + minutes.substr(-2);				
								let current_date = dd + '/' + mm + '/' + yy;
								if(previous_date != current_date){
									previous_date = dd + '/' + mm + '/' + yy;
									chatHTML += '<div class="date">'+previous_date+'</div>'
								}
								let message = doc.data().message;
							
							if (doc.data().user_1_uuid == user_uuid) {	
								let image_class = "user-image";
								if(user_image !='' && user_image!=undefined){
									image_class='';
								}						
								if(doc.data().type == 'image'){
										chatHTML += '<div class="message-block">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ doc.data().message +' target="_blank"><img src='+ doc.data().message +' width="60" height="50" ></img></a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}
								else if(doc.data().type == 'file'){
										chatHTML += '<div class="message-block">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ doc.data().message +' target="_blank" >Download</a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}
								else{
										chatHTML += '<div class="message-block">'+
														'<div class="user-icon"></div>'+
														'<div class="message">'+ message.replace(/(<([^>]+)>)/ig,"") + '</div>'+
														'<div class="time">'+ formattedTime +'</div>'+
													'</div>';
								}

							}else{
								db.collection("chat").doc(doc.id).set({ user_2_isView: 1 }, { merge: true })								
								if(doc.data().type == 'image'){
										chatHTML += '<div class="message-block received-message">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ doc.data().message +' target="_blank"><img src='+ doc.data().message +' width="60" height="50" ></img></a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}
								else if(doc.data().type == 'file'){
										chatHTML += '<div class="message-block received-message">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ doc.data().message +' target="_blank" >Download</a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}else{
										chatHTML += '<div class="message-block received-message">'+
												'<div class="user-icon"></div>'+
												'<div class="message">'+ message.replace(/(<([^>]+)>)/ig,"") +'</div>'+
												'<div class="time">'+ formattedTime +'</div>'+
											'</div>';
											
								}
							}

						});
						$(".message-container").html(chatHTML);

					});					
					if (chat_uuid == "") {
						chat_uuid = chat_data.chat_uuid;
						realTime('test');
					}

				}
			});


		})	
			
		$(".send-file").on('change', function(e){
			//var message = $(".message-input").val();
			let fileName = e.target.files[0];
			let file_name = e.target.files[0].name;
			let extension = file_name.split('.').slice(1).pop();
			let storageRef = firebase.storage().ref('upload/' + file_name);
			//storageRef.put(fileName);
			let type = "file";
			if((extension == "jpg") || (extension == "png") || (extension == "jpeg") || (extension == "svg")){
				type = "image";
			}
			storageRef.put(fileName).then(function(result){
				storageRef.getDownloadURL().then(function(url) {
					db.collection("chat").add({
						message : url,
						type : type,
						user_1_uuid : user_uuid,
						user_2_uuid : chat_data.user_2_uuid,
						chat_uuid : chat_data.chat_uuid,
						user_1_isView : 1,
						user_2_isView : 0,
						time : new Date(),
					})
					.then(function(docRef) {
						$(".send-file").val(null);
						console.log("Document written with ID: ", docRef.id);
					})
					.catch(function(error) {
						console.error("Error adding document: ", error);
					});
				}).catch(function(error) {
					console.log('============download error============');
					console.log(error);
				});	 
			}).catch(function(error) {
					console.log('============upload error============');
					console.log(error);
			});	       
			 
		});

		$(".send-btn").on('click', function(){			
			var message = $(".message-input").val();
			if(message != ""){
				db.collection("chat").add({
				    message : message,
				    type : 'text',
				    user_1_uuid : user_uuid,
				    user_2_uuid : chat_data.user_2_uuid,
				    chat_uuid : chat_data.chat_uuid,
				   	user_1_isView : 1,
				   	user_2_isView : 0,
				    time : new Date(),
				})
				.then(function(docRef) {
					$(".message-input").val("");
				    console.log("Document written with ID: ", docRef.id);
				})
				.catch(function(error) {
				    console.error("Error adding document: ", error);
				});
			}else{
				alert("Please enter message");
			}
		});
		var newMessage = '';
		function realTime(key){		
			db.collection('chat').where('chat_uuid', '==', chat_data.chat_uuid)
			.orderBy('time')
			.onSnapshot(function(snapshot) {
				newMessage = '';
				let new_date = new Date();
				const month = new_date.getMonth()+1;
				let previous_date = new_date.getDate()+'/'+month+'/'+new_date.getFullYear()
				 if(chatHTML){
					previous_date = "";
				}
		        snapshot.docChanges().forEach(function(change) {					
		            if (change.type === "added") {
						let unix_timestamp = change.doc.data().time.seconds;
						let date = new Date(unix_timestamp * 1000);
						let yy = date.getFullYear();
						let mm = date.getMonth()+1;
						let dd = date.getDate();
						let hours = date.getHours();
						let minutes = "0" + date.getMinutes();
						//let formattedTime = dd + '/' + mm + '/' + yy +' '+ hours + ':' + minutes.substr(-2);	
						let formattedTime = date.toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'}) //output: "May 21, 2019"
						//let formattedTime = hours + ':' + minutes.substr(-2);	
						let current_date = dd + '/' + mm + '/' + yy;								
						if(previous_date != current_date){
							previous_date = dd + '/' + mm + '/' + yy;
							newMessage += '<div class="date">'+previous_date+'</div>'
						}
						let message = change.doc.data().message;
						var imgTag =  $('#'+change.doc.data().user_1_uuid).find('img').attr("src");
						if (change.doc.data().user_1_uuid == user_uuid) {
								if(change.doc.data().type == 'image'){
										newMessage += '<div class="message-block">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ change.doc.data().message +' target="_blank"><img src='+ change.doc.data().message +' width="60" height="50" ></img></a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}
								else if(change.doc.data().type == 'file'){
										newMessage += '<div class="message-block">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ change.doc.data().message +' target="_blank" >Download</a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}
								else{
									newMessage += '<div class="message-block">'+
													'<div class="user-icon"></div>'+
													'<div class="message">'+ message.replace(/(<([^>]+)>)/ig,"") +'</div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}
							}else{
								if(change.doc.data().type == 'image'){
										newMessage += '<div class="message-block received-message">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ change.doc.data().message +' target="_blank"><img src='+ change.doc.data().message +' width="60" height="50" ></img></a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}
								else if(change.doc.data().type == 'file'){
										newMessage += '<div class="message-block received-message">'+
													'<div class="user-icon"></div>'+
													'<div class="message"><a href='+ change.doc.data().message +' target="_blank" >Download</a></div>'+
													'<div class="time">'+ formattedTime +'</div>'+
												'</div>';
								}else{
										newMessage += '<div class="message-block received-message">'+
												'<div class="user-icon"></div>'+
												'<div class="message">'+ message.replace(/(<([^>]+)>)/ig,"") +'</div>'+
												'<div class="time">'+ formattedTime +'</div>'+
											'</div>';
								}
							}

		            }
		        });	 

		        if (chatHTML != newMessage) {
		        	$('.message-container').append(newMessage);
		        }
		        
		        $(".chats").scrollTop($(".chats")[0].scrollHeight);

		    });	

		}
		
		setInterval(function(){
			 const toUser = $("#toid").val();
			 const fromUser = user_uuid;
			// alert(fromUser);
			getUsershtml();
			updateuserstatus();
			if(toUser){
			 cleanMessage(toUser, fromUser)	
		 }		 
		}, 5000);
		function getUsershtml(){
			$( ".user" ).each(function() {
				var user_1 = user_uuid;
				var user_2 = $(this).attr('uuid');
				if (user_uuid != user_2) {
					get_user_count(user_uuid,user_2);
				}
			})
		}
		
		function updateuserstatus(){
			$.ajax({
				url : 'process.php',
				method : 'POST',
				data : {getUsers:1},
				success : function(response){
					var login_user = firebase.auth().currentUser;					
					var resp = JSON.parse(response);
					if(resp.status == 200){
						var users = resp.message.users;
						var usersHTML = '';
						var messageCount = '';
						$.each(users, function(index, value){													
							if (user_uuid != value.uuid) {
								let status_class ='';
								//let login_status = '<span></span>'
								if(value.status=='1'){
									status_class = 'active';
									$('#'+value.uuid).addClass(status_class);	
									$('.last_'+value.uuid+' span').removeAttr("class");	
									$('.last_'+value.uuid).text('');	
								}else{
									$('#'+value.uuid).removeClass('active'); 
									//let login_status = '<span class="last_'+value.uuid+'">'+value.last_login+'</span>'
									$('.last_'+value.uuid).text(value.last_login);															
								}															
							}				
						});
					}
				}
			});
		}
		
		function cleanMessage(to, from){
			$.ajax({
				url : 'process.php',
				method : 'POST',
				data : {connectUser:1, user_1:from, user_2: to},
				success : function(resposne){
					var resp = JSON.parse(resposne);
					chat_data = {
						chat_uuid : resp.message.chat_uuid,
						user_1_uuid : resp.message.user_1_uuid,
						user_2_uuid : resp.message.user_2_uuid,
						user_1_name : '',
						user_2_name : name
					};
					
					db.collection('chat').where('chat_uuid', '==', chat_data.chat_uuid)
					.orderBy("time")
					.get().then(function(querySnapshot){						
						querySnapshot.forEach(function(doc){
							if (doc.data().user_1_uuid != user_uuid) {
								db.collection("chat").doc(doc.id).set({ user_2_isView: 1 }, { merge: true })	
							}						
						})
					})
				}
			})
			
		}
