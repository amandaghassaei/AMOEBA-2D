#!/bin/sh

rsync -r -v --exclude=".*" ~/Research/WebApps/DMDesign ~/Projects/dma/Web/

cd ~/Projects/dma
hg addremove .
hg ci -m "deploy from script"
hg push