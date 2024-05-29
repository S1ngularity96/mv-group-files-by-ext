INSTALLDIR=/usr/local/bin/mv-group-files-by-ext
APP=mv-group-files-by-ext.ts
all: help

help:
	@printf "Available targets: help, install, uninstall \n"

install:
	sudo ln -s $(PWD)/$(APP) $(INSTALLDIR)
	@printf "Installed \n"

uninstall:
	sudo rm $(INSTALLDIR)
	@printf "Uninstalled \n"
