angular.module('starter.controllers', [])

.constant('ApiEndpoint', {
    url: 'http://localhost:8080/api'
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('homeCtrl', function($scope, $http, ApiEndpoint, $ionicPopup) {

  $scope.message = "¡Bienvenido!";
  $scope.newStudent = {};
  $scope.selected = false;

  // Función para registrar estudiante
  $scope.registrarEstudiante = function() {
    $http.post(ApiEndpoint.url + '/estudiant', $scope.newStudent)
      .success(function(data) {
        $scope.newStudent = {}; // Borramos los datos del formulario
        console.log('Registrado correctamente');
        $scope.estudiants = data;
        var alertPopup = $ionicPopup.alert({
          title: 'Información',
          template: 'Registrado correctamente'
        });
      })
      .error(function(data) {
        console.log('Error: ' + data);
        var alertPopup = $ionicPopup.alert({
          title: 'Información',
          template: 'Revisa el formulario'
        });
      });
  };

})


.controller('subjectsCtrl', function($scope, $http, ApiEndpoint) {
  $scope.message = "Página asignaturas";
  $scope.newSubject = {};
  $scope.subjects = {};

  // Obtenemos todas las asignaturas
  $http.get(ApiEndpoint.url + '/subject').success(function(data) {
    $scope.subjects = data;
    console.log('Get Data: ' + data);
  })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // Añadir nueva asignatura
  $scope.addSubject = function() {
    $http.post(ApiEndpoint.url + '/subject', $scope.newSubject) // Enviamos la nueva asignatura (el nombre)
      .success(function(data) {
        $scope.newSubject = {}; // Borramos los datos del formulario
        $scope.subjects = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // Función para eliminar asignatura
  $scope.deleteAssignatura = function(id) {
    $http.delete(ApiEndpoint.url + '/subject/' + id)
      .success(function(data) {
        $scope.newSubject = {};
        $scope.subjects = data;
        $scope.selected = false;
        console.log('Asignatura eliminada correctamente');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

})

.controller('subjectsDetailCtrl', function($scope, $http, ApiEndpoint, $state, $ionicPopup) {

  $scope.message = "Estudiantes matriculados";
  $scope.updatedSubject = {};
  $scope.estudiantsList = {};
  $scope.subject = {};
  $scope.subjectID = ($state.params.subjectId); //Obtenemos ID de la URI de subjectId
  console.log($scope.subjectID);
  var liststudents = [];

  //Obtenemos detalle estudiante
  $http.get(ApiEndpoint.url + '/subject/' + $scope.subjectID)
    .success(function(data) {
      $scope.subject = data;
      console.log($scope.subject);

      // Función para mostrar el nombre de usuario en vez de su ID
      angular.forEach($scope.subject.estudiants, function(student, key) {
        //console.log("Alumnos inscritos en", $scope.subject.name, ":", estudiant);
          $http.get(ApiEndpoint.url + '/estudiant/' + estudiant)
            .success(function(data) {
              $scope.estudiant = data;
              liststudents.push($scope.estudiant); //Añade nombre estudiante dentro de lista
              $scope.estudiantsList = liststudents;
              console.log("Nombre de alumnos en", $scope.subject.name, ":", $scope.estudiantsList);
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });
      });
      // FIN función para mostrar el nombre de usuario en vez de su ID
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // Función para añadir alumno a asignatura
  $scope.addEstudiant = function() {
    console.log($scope.subjectID);
    console.log($scope.newStudent);
    $http.post(ApiEndpoint.url + '/subject/' + $scope.subjectID, $scope.updatedSubject)
      .success(function(data) {
        $scope.subject = data;
        $state.reload();
        //location.reload();
        console.log('Añadido correctamente a la asignatura');
        //PopUp
        if ($scope.subject == null){
          var alertPopup = $ionicPopup.alert({
            title: 'Información',
            template: 'Este usuario no existe o ya está en la lista'
          });
        }
        else
        {
          var alertPopup = $ionicPopup.alert({
            title: 'Información',
            template: 'Añadido correctamente'
          });
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
        var alertPopup = $ionicPopup.alert({
          title: 'Información',
          template: 'Ese estudiante no existe'
        });
      });
  };

})

.controller('studentsCtrl', function($scope, $http, ApiEndpoint) {
  $scope.message = "Página estudiantes";
  $scope.estudiants = {};

  // Obtenemos todos los estudiantes
  $http.get(ApiEndpoint.url + '/estudiant').success(function(data) {
    $scope.estudiants = data;
    console.log('Get Data: ' + data);
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });

})

.controller('studentsDetailCtrl', function($scope, $http, ApiEndpoint, $state) {

  $scope.message = "Detalle estudiante";
  $scope.studentID = ($state.params.studentId); //Obtenemos ID de la URI
  console.log($scope.studentID);

  //Obtenemos detalle estudiante
  $http.get(ApiEndpoint.url + '/estudiant/' + $scope.studentID)
    .success(function(data) {
      $scope.estudiant = data;
      console.log($scope.estudiant);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // Función para eliminar estudiante
  $scope.remove = function(id) {
    $http.delete(ApiEndpoint.url + '/estudiant/' + id)
      .success(function(data) {
        //$scope.newStudent = {};
        //$scope.estudiants = data;
        //$scope.selected = false;
        console.log("Estudiante", id, "eliminado correctamente.", data);
        $state.go('app.students');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };



});
