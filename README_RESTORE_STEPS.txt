YardPromo exact visual restore pack

Replace the matching files in your Next.js project with the files in this pack.
Do not replace or edit:
.env.local
lib/supabaseClient.js
components/AuthNav.js
app/login
app/admin
app/dashboard
app/u
package.json
package-lock.json
next.config.js
jsconfig.json

After copying, run in VS Code PowerShell:

taskkill /F /IM node.exe
Remove-Item -Recurse -Force .next
$env:Path = "C:\Users\home\nodejs;$env:Path"
& "C:\Users\home\nodejs\npm.cmd" run dev

Then hard refresh Chrome with Ctrl + F5.
