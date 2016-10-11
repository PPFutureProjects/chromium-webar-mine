rm -rf Backup_WebAR/*
# WebKit vr
mkdir -p Backup_WebAR/third_party/WebKit/Source/modules/vr
cp src/third_party/WebKit/Source/modules/vr/VRController.* Backup_WebAR/third_party/WebKit/Source/modules/vr/
cp src/third_party/WebKit/Source/modules/vr/VRDisplay.* Backup_WebAR/third_party/WebKit/Source/modules/vr/
cp src/third_party/WebKit/Source/modules/vr/VRPointCloud.* Backup_WebAR/third_party/WebKit/Source/modules/vr/
cp src/third_party/WebKit/Source/modules/vr/VRSeeThroughCamera.* Backup_WebAR/third_party/WebKit/Source/modules/vr/
cp src/third_party/WebKit/Source/modules/vr/VRDisplayCapabilities.* Backup_WebAR/third_party/WebKit/Source/modules/vr/
cp src/third_party/WebKit/Source/modules/vr/VRPickingPointAndPlane.* Backup_WebAR/third_party/WebKit/Source/modules/vr/
cp src/third_party/WebKit/Source/modules/BUILD.gn Backup_WebAR/third_party/WebKit/Source/modules
cp src/third_party/WebKit/Source/modules/modules.gypi Backup_WebAR/third_party/WebKit/Source/modules
# WebKit WebGL
mkdir -p Backup_WebAR/third_party/WebKit/Source/modules/webgl
cp src/third_party/WebKit/Source/modules/webgl/WebGLRenderingContextBase.* Backup_WebAR/third_party/WebKit/Source/modules/webgl/
cp src/third_party/WebKit/Source/modules/webgl/WebGL2RenderingContextBase.* Backup_WebAR/third_party/WebKit/Source/modules/webgl/
# ThirdParty Tango
mkdir -p Backup_WebAR/third_party/tango
cp -r src/third_party/tango Backup_WebAR/third_party/
# VR device Tango
# NOTE: Could copy only the elements that have been changed.
mkdir -p Backup_WebAR/device/vr
cp -r src/device/vr Backup_WebAR/device/
mkdir -p Backup_WebAR/android_webview/test
# GPU command buffer
mkdir -p Backup_WebAR/gpu/command_buffer/service
cp src/gpu/BUILD.gn Backup_WebAR/gpu
cp src/gpu/command_buffer/service/BUILD.gn Backup_WebAR/gpu/command_buffer/service
cp src/gpu/command_buffer/build_gles2_cmd_buffer.py Backup_WebAR/gpu/command_buffer
cp src/gpu/command_buffer/cmd_buffer_functions.txt Backup_WebAR/gpu/command_buffer
cp src/gpu/command_buffer/service/gles2_cmd_decoder.cc Backup_WebAR/gpu/command_buffer/service
cp src/gpu/command_buffer/service/gles2_cmd_decoder_passthrough_doer_prototypes.h Backup_WebAR/gpu/command_buffer/service
cp src/gpu/command_buffer/service/gles2_cmd_decoder_passthrough_doers.cc Backup_WebAR/gpu/command_buffer/service
# Android Chromium Webview
# NOTE: Could copy only the elements that have been changed.
cp -r src/android_webview/test/shell Backup_WebAR/android_webview/test
cp src/android_webview/test/BUILD.gn Backup_WebAR/android_webview/test

# Build script, notes, backup script, examples, ... 
cp src/build_install_run.sh Backup_WebAR
cp src/Notes*.txt Backup_WebAR/
mkdir -p Backup_WebAR/examples
cp ./backupwebar.sh Backup_WebAR
#cp -r ~/Coding/www/tango/* Backup_WebAR/examples

# NOTE: This is a hack and should not be needed. Remember to remove it from the backup once the right way to solve it is achieved.
mkdir -p Backup_WebAR/build/android/gyp
cp src/build/android/gyp/dex.py Backup_WebAR/build/android/gyp