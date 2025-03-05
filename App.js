import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Modal } from 'react-native';
import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';

const App = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const camera = useRef(null);
  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [currentDevice, setCurrentDevice] = useState(backDevice);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (hasPermission === false) {
      requestPermission();
    } else if (hasPermission && backDevice) {
      setCurrentDevice(backDevice);
    }   
  }, [hasPermission, backDevice]);

  const handleCapture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          flash: 'off',
        });
        console.log('Photo captured:', photo.path);
        setCapturedPhoto(photo.path);
      } catch (error) {
       console.error('Error capturing image:', error);
      }
    }
  };

  const handlePress = () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      setIsCameraActive(false);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 1000);
    }
  };

  const handlePermissionDeniedPress = () => {
    setIsCameraActive(true);
  };

  const toggleCamera = () => {
    setCurrentDevice(currentDevice === frontDevice ? backDevice : frontDevice);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!currentDevice) {
    return (
      <View style={styles.container}>
        <Text>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasPermission && currentDevice && isCameraActive ? (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={currentDevice}
            ref={camera}
            isActive={true}
            photo={true}
          />
          <View style={styles.crossContainer}>
            <TouchableOpacity disabled={isButtonDisabled} onPress={handlePress}>
            <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.captureButtonContainer}>
            {capturedPhoto && (
              <TouchableOpacity onPress={openModal}>
                <Image source={{ uri: `file://${capturedPhoto}` }} style={styles.capturedImage} />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
              <View style={styles.outerCircle} />
              <View style={styles.innerCircle} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCamera} style={styles.toggleButton}>
              <Text>Flip</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.permissionDeniedContainer}>
          <TouchableOpacity onPress={handlePermissionDeniedPress}>
            <Text>Open to camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for Full Image View */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: `file://${capturedPhoto}` }} style={styles.fullImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginHorizontal: 20,
  },
  captureButton: {
    backgroundColor: 'red',
    width: 75,
    height: 75,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginLeft: 20,
  },
  outerCircle: {
    backgroundColor: 'pink',
    width: 65,
    height: 65,
    borderRadius: 99,
    position: 'absolute',
  },
  innerCircle: {
    backgroundColor: '#FFF',
    width: 55,
    height: 55,
    borderRadius: 99,
  },
  capturedImage: {
    width: 75,
    height: 75,
    borderRadius: 99,
    marginRight: 20,
    transform: [{ rotate: '270deg' }],
  },
  permissionDeniedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  crossContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 170,
    right: 25,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  fullImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
 
});

export default App;
