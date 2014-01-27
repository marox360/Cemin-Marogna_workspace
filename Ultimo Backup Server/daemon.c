#include <stdio.h>
#include <string.h>
int main(void)
{
   FILE *fpipe;
   char *command="ps x | grep app.js", *command2="/etc/init.d/hostapd status";
   char line[256];
   int running=0, hostapd=1;

   if ( !(fpipe = (FILE*)popen(command,"r")) )
   { 
      perror("Errore!");
      return(1);
   }
   while ( fgets( line, sizeof line, fpipe))
   {
     if(strstr(line,"/home/pi/server/app.js")!=NULL)
	running=1;
   }
   pclose(fpipe);
   if ( !(fpipe = (FILE*)popen(command2,"r")) )
   { 
      perror("Errore!");
      return(1);
   }
 /*  while ( fgets( line, sizeof line, fpipe))
   {
     if(strstr(line,"failed")!=NULL)
        hostapd=0;
   }
   pclose(fpipe);
*/
   if(!running){
	printf("Starting UniBo Motorsport daemon...");
        //execl("/usr/local/bin/php", "-f", "/home/foomail/public_html/temp/foobot.php","&", (char *) 0);
	system("/usr/bin/nohup /usr/bin/node \"/home/pi/server/app.js\" 2>/dev/null 1>/dev/null &");
	printf("[OK]\n");
   }
 /*  if(!hostapd){
        printf("Starting hostapd...");
        //execl("/usr/local/bin/php", "-f", "/home/foomail/public_html/temp/foobot.php","&", (char *) 0);
        system("/etc/init.d/hostapd restart");
        printf("[OK]\n");
   }
*/
   return 0;
}

