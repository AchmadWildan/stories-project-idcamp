import { convertBase64ToUint8Array } from './index';
import CONFIG from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Izin notifikasi ditolak.",
    }).then(() => {
      console.error('Izin notifikasi ditolak.');
    }
    );
    return false;
  }

  if (status === 'default') {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Izin notifikasi ditutup atau diabaikan.",
    }).then(() => {
      console.error('Izin notifikasi ditutup atau diabaikan.');
    }
    );

    return false;
  }
  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}
export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}
export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    Swal.fire({
      icon: "success",
      title: "Sudah berlangganan push notification.",
    }).then(() => {
      console.log('Sudah berlangganan push notification.');
    }
    );
    return;
  }

  console.log('Mulai berlangganan push notification...');
  const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error('subscribe: response:', response);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: failureSubscribeMessage,
      }).then(() => {
        console.error(failureSubscribeMessage);
      }
      );
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
      return;
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: successSubscribeMessage,
      showConfirmButton: false,
      timer: 1500
    })
    // console.log({ endpoint, keys });
  } catch (error) {
    console.error('subscribe: error:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: failureSubscribeMessage,
      }).then(() => {
        console.error(failureSubscribeMessage);
      }
      );
    await pushSubscription.unsubscribe();
  }
}
export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.",
      }).then(() => {
        console.error('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
      }
      );
      return;
    }
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });
    if (!response.ok) {
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: failureUnsubscribeMessage,
      }).then(() => {
        console.error(failureUnsubscribeMessage);
      }
      );
      console.error('unsubscribe: response:', response);
      return;
    }
    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: failureUnsubscribeMessage,
      }).then(() => {
        console.error(failureUnsubscribeMessage);
      }
      );
      await subscribePushNotification({ endpoint, keys });
      return;
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: successUnsubscribeMessage,
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: failureUnsubscribeMessage,
      }).then(() => {
        console.error(failureUnsubscribeMessage);
      }
      );
    console.error('unsubscribe: error:', error);
  }
}