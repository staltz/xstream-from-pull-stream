import xs, { Stream, Listener, Producer } from "xstream";

function xsFromPullStream<T>(pullStream: any): Stream<T> {
  const producer: Producer<T> & { isRunning: boolean } = {
    isRunning: false,
    start(listener: Listener<T>): void {
      const drain = function drain(read: Function) {
        read(null, function more(end: any | boolean, data: T) {
          if (end === true) {
            listener.complete();
            return;
          }
          if (end) {
            listener.error(end);
            return;
          }
          listener.next(data);
          if (producer.isRunning) {
            read(null, more);
          }
        });
      };

      producer.isRunning = true;

      try {
        drain(pullStream);
      } catch (e) {
        listener.error(e);
      }
    },
    stop(): void {
      producer.isRunning = false;
    }
  };

  return xs.create(producer);
}

export default xsFromPullStream;
