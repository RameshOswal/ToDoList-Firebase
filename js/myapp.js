var myDataRef = new Firebase("https://logintodo.firebaseio.com/login/users");
var myTaskRef = new Firebase("https://logintodo.firebaseio.com/login/tasks");

myapp = angular.module("myapp",['ngRoute']);	
myapp.service('logintaskservice',function(){
		this.currentUserId = "";
		this.getCurrentUserId = function (){return this.currentUserId;};
		this.setCurrentUserId = function (userid){//alert("in setuser" + userid);
			this.currentUserId = userid;
			};

	});

myapp.config(function($routeProvider) {
    $routeProvider
    	.when('/index', {
    		templateUrl: 'login.html',
            controller: 'logincontroller'
    	})	
    	.when('/task', {
    		templateUrl: 'task.html',
            controller: 'taskcontroller'
    	})
		.otherwise({
        redirectTo: '/index'
      });
});
	
myapp.controller("taskcontroller",function($scope,logintaskservice){
				$scope.taskno = Math.floor(Math.random()*1000);
				
				$scope.myData = {}; 
				$scope.myData.myText = "" ;
				$scope.myData.myText.myDescription = "";
				$scope.myTask = [];
			    //code to remove extra task which shows username and password in task from firebase
				$scope.totalTaskDisplayed = 0;
				
				//
				alert("inside task controller " +logintaskservice.getCurrentUserId());
				//alert(data.val().count);
				//
				//$scope.myTask.push({taskno :$scope.taskno, todo : "item1", description:"my desc",done:false ,showeditTB:false,showDescription:false});
				$scope.refreshTaskList = function(){
						myTaskRef.once('value',function(data){
						//$scope.totalTaskDisplayed=Object.keys(data.val()).length-2;
						//alert("totask dislpla is " +$scope.totalTaskDisplayed );//limit to is not working
						$scope.mytempTask = data.val();
						for( var task in $scope.mytempTask)
							if($scope.mytempTask[task].userid == logintaskservice.getCurrentUserId())
								$scope.myTask.push($scope.mytempTask[task]);
						//alert($scope.myTask.length);
						//$scope.mydataval = data.val();
					});
				
				};
				
				// refreshing task list from data base
				$scope.refreshTaskList();
				
				
				$scope.addTask = function (){	
					var temp;
					if($scope.myData.myText == "")
						alert("Plz enter a task to add");
					else{
						//alert("pusging task");
						temp ={taskno : $scope.taskno, todo: $scope.myData.myText, description: $scope.myData.myDescription ,done:false,showeditTB:false,showDescription:false};
						//alert(temp.taskno + "    " + temp.todo);
						//$scope.myTask.push(temp);
					}
					$scope.taskno++;	
					myTaskRef.push(temp);
					$scope.myData.myText = "";
					$scope.myData.myDescription = "";
					$scope.refreshTaskList();
				};
				
				$scope.editTask = function(tasknum){
					$index = 0;
					for(var i= 0;i<$scope.myTask.length;i++){
						if($scope.myTask[i].taskno == tasknum){
							//alert("mila");
							break;
						}//if
						$index++;
					}//foreach
					//show textbox to edit
					$scope.myTask[$index].showeditTB = !$scope.myTask[$index].showeditTB;
					
					//alert($index);
					//$scope.myData.myText = $scope.myTask[$index].todo;
					//alert("aya");
					//$scope.myTask.splice($index,1);
				};
				$scope.isDone = function (tasknum){
					$index = 0;
					//alert("aya");
					for(var i= 0;i<$scope.myTask.length;i++){
						if($scope.myTask[i].taskno == tasknum){
							//alert("mila");
							break;
						}//if
						$index++;
					}//foreach
					return $scope.myTask[$index].done ;
					
				};
				$scope.toggle = function (tasknum){
					$index = 0;
					//alert("aya");
					for(var i= 0;i<$scope.myTask.length;i++){
						if($scope.myTask[i].taskno == tasknum){
							//alert("mila");
							break;
						}//if
						$index++;
					}//foreach
					 $scope.myTask[$index].done = !$scope.myTask[$index].done ;
					
				};
				$scope.delTask = function(tasknum){
					$index = 0;
					//alert("aya");
					for(var i= 0;i<$scope.myTask.length;i++){
						if($scope.myTask[i].taskno == tasknum){
							//alert("mila");
							break;
						}//if
						$index++;
					}//foreach
					if( $scope.myTask[$index].done == true)
					 $scope.myTask.splice($index,1);
					else
						alert("First mark as done");
					
				};
				
			});


myapp.controller("logincontroller",function($scope,$location,logintaskservice) {
			//$scope.myusers= [{username:"hello",password:"hi"}]; 
			$scope.username = "ramesh";
			$scope.password = "prakash";
			
			$scope.validateCredentials = function(){
				//myDataRef.push({name:"ramesh",surname:"oswal"});
				//alert("aya");
				myDataRef.once('value',function(data){
						//alert("sdsd");
						//alert(data.val());
						var objects = data.val();
						//console.log(objects);
						var x=Object.keys(objects).length;
						var flag = false;
						for(var obj in objects){
							if(objects[obj].username == $scope.username&& objects[obj].password == $scope.password){
								//alert("u succesfully logged in");
								logintaskservice.setCurrentUserId(objects[obj].userid);
								alert(logintaskservice.getCurrentUserId());
								
								flag=true;
								break;
							}
						}
						if(flag==true){
								//alert("u succesfully logged ");
								//$("#output").removeClass(' alert alert-danger');
								//$("#output").addClass("alert alert-success alert-dismissible").html("You are Logged in" + $scope.username);
								//$location.absurl("file:///C:/Users/Oswal/Desktop/prac/working%20on%20firebase%20-%20Copy%20(2)/task.html");
								$location.path("/task");
							}
							else{
								//alert("incorrect combination");
								$("#output").removeClass(' alert alert-success alert-dismissible');
								$("#output").addClass("alert alert-danger ").html("sorry enter a correct username password");
							}
						//$scope.myusers.push( objects[obj]);
					});
				}
			
			
		});	
	
