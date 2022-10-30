# These commands are a prerequisite that the SonarQube instance (Elastic + PostgreSQL) successfully runs and are used in a privileged container.

sysctl -w vm.max_map_count=524288
sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192
