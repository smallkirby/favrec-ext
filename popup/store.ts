import { functions } from '../background/lib/firebase/app';
import { FirebaseError } from 'firebase/app';
import { httpsCallable } from 'firebase/functions';

export class PrettyFirebaseError extends Error {
  readonly code: string;
  readonly message: string;

  constructor(error: Error) {
    super(error.message);

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'permission-denied':
          this.code = 'permission-denied';
          this.message = 'Permisson Denied.';
          break;
        default:
          this.code = 'unknown';
          this.message = error.message;
          break;
      }
    } else {
      this.code = 'unknown';
      this.message = error.message;
    }
  }
}

export const recordFav = async (
  url: string
): Promise<null | PrettyFirebaseError> => {
  const callable = httpsCallable(functions, 'recordPageInfo');

  return await callable({ url })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((res: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (res.data.err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return new PrettyFirebaseError(new Error(res.data.err as string));
      } else {
        return null;
      }
    })
    .catch((err) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return new PrettyFirebaseError(err as string);
    });
};
