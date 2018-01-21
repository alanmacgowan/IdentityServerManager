FROM microsoft/mssql-server-linux
ENV SA_PASSWORD=Passw0rd
ENV ACCEPT_EULA=Y
COPY sleep.sh sleep.sh
COPY entrypoint.sh entrypoint.sh
COPY sqlstartup.sh sqlstartup.sh
COPY database.sql database.sql
RUN chmod +x ./sqlstartup.sh
CMD /bin/bash ./entrypoint.sh