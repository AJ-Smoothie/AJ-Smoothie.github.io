###You need a ssh-rsa key for this!

1. In cmdprompt, bash `ssh-keygen -t rsa -b 4096 -C "Computer_NAame"`
2. In cmdprompt, bash `type %USERPROFILE%\.ssh\id_rsa.pub` . This will pull up your key, copy it starting at ssh-rsa
3. SSH into your Pi and bash `nano ~/.ssh/authorized_keys`. Copy your key on a new line
4. `Ctrl+O` & `Enter` & `Ctrl+X`
5. Bash `exit`
6. Reconnect without a password!
