var SERVER_BASE_URL = 'http://localhost:8080/';

var serverConnector = {
  getUserById : function() {
			var userId = $('#plugin_user_id_input').val();
			var url = SERVER_BASE_URL+"user/"+userId;
			serverConnector.clearOutputAreas();
			$.ajax({
				url: url,
				success : 	function(data){
							var html="<p class='bg-success'>User Permissions</p><table class='table table-striped'>"
							for(i in data) {
								html=html+"<tr><td>"+data[i]+"</td></tr>";
							}
							html=html+"</table>";
							$("#plugin_response_area").html(html);
						},
				error : 	function(jqxhr,error_message,error_thrown) {
							console.log("Error");
							$("#plugin_error_message_label").html(jqxhr.responseText);
						},
				complete :	function() {
							//remove mask
							console.log("Done!");
						}
			});
		},

  prepareScreen1Buttons : function() {
		       		$("#plugin_fetch_user_button").hide();
				$("#plugin_create_user_button").hide();
				$("#plugin_save_user_button").show();
				$("#plugin_cancel_user_button").show();
		       },

  prepareScreen0Buttons : function() {
			  	$("#plugin_fetch_user_button").show();
				$("#plugin_create_user_button").show();
				$("#plugin_save_user_button").hide();
				$("#plugin_cancel_user_button").hide();

			  },

  clearOutputAreas : function() {
		     	$("#plugin_response_area").html("");
		     	$("#plugin_error_message_label").html("");
			$("#plugin_select_role_area").html("");
			$("#plugin_success_message_label").html("");
		     },

  createUser : function() {
			serverConnector.clearOutputAreas();
			var url = SERVER_BASE_URL+"roles";
			$.ajax({
				url : 	url,
				success : function(data) {
						var html = "";
						for(i in data) {
							html = html+"<input type='checkbox' value='"+data[i]+"'>"+data[i]+"</input></br>";
						}
						$("#plugin_select_role_area").html(html);
				},
				error : function() {
						$("#plugin_error_message_label").html("Error Connecting to the server");
					},
				complete : function() {
						   serverConnector.prepareScreen1Buttons();
					   }
			});
	       },

  cancel : function() {
	   	serverConnector.clearOutputAreas();
		serverConnector.prepareScreen0Buttons();
	   },

  saveUser : function() {
		var data = {};
		data['id'] = $("#plugin_user_id_input").val()
		data['roles'] = [];
		var checkboxes = $("[type=checkbox]");
		for(i in checkboxes) {
			if(checkboxes[i].checked) {
				data['roles'].push($(checkboxes[i]).val());
			}
		}
		console.log(data);
		var url = SERVER_BASE_URL + "user";
		$.ajax({
			url : url,
			type : "POST",
			data : JSON.stringify(data),
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				serverConnector.clearOutputAreas();
				$("#plugin_success_message_label").html("User created.");
				serverConnector.prepareScreen0Buttons();
			},
			error : function(jqxhr) {
				$("#plugin_error_message_label").html(jqxhr.responseText);
			},
		});
	},

  initialize : function() {
		       	serverConnector.prepareScreen0Buttons();
		       	$("#plugin_fetch_user_button").on('click',serverConnector.getUserById);
		 	$("#plugin_create_user_button").on('click',serverConnector.createUser);
 			$("#plugin_cancel_user_button").on('click',serverConnector.cancel);
			$("#plugin_save_user_button").on('click',serverConnector.saveUser);
	       		$("#mainForm").submit(function(e){
				    return false;
			});
	       },
};

window.addEventListener("load", serverConnector.initialize);


