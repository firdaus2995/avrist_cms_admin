node {
    def WORKSPACE = "/var/lib/jenkins/workspace/avrist-admin-web-deploy"
    def dockerImageTag = "avrist-admin-web-deploy${env.BUILD_NUMBER}"
try{
    notifyBuild('STARTED')
    stage('Clone Repo') {
        git url: 'git@gitlab.com:bit-avrist-website/avrist-cms-admin-page-web.git',
            credentialsId: 'avrist-sit-fe',
            branch: 'sit'
     }
    stage('Build Static HTML'){
        echo "Build Static HTML in Build Number : ${env.BUILD_NUMBER}"
        sh "cp .env.sit .env"
        sh "yarn"
        sh "yarn add ./ckeditor5"
        sh "yarn run build"
        echo "Build Successfully"
    }
    stage("Deploy Static HTML to Docker"){
        echo "Deploy Static HTML in Build Number : ${env.BUILD_NUMBER}"
        sh "sudo docker-compose down"
        sh "sudo docker-compose up -d --build"
        echo "Deployed Successfully"
    }
}catch(e){
    currentBuild.result = "FAILED"
    throw e
}finally{
    notifyBuild(currentBuild.result)
 }
}


def notifyBuild(String buildStatus = 'STARTED'){
  
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'
  
  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def now = new Date()
  
  // message
  def subject = "${buildStatus}, Job: ${env.JOB_NAME} API - Deployment Sequence: [${env.BUILD_NUMBER}] "
  def summary = "${subject} - Check On: (${env.BUILD_URL}) - Time: ${now}"
  def subject_email = "Avrist Web Admin Deployment"
  def details = """<p>${buildStatus} JOB </p>
    <p>Job: ${env.JOB_NAME} - Deployment Sequence: [${env.BUILD_NUMBER}] - Time: ${now}</p>
    <p>Check console output at "<a href="${env.BUILD_URL}">${env.JOB_NAME}</a>"</p>"""
  
  // Email notification
  emailext (
     to: "ari.permana@barito.tech",
     subject: subject_email,
     body: details,
     recipientProviders: [[$class: 'DevelopersRecipientProvider']]
  )
    
}
