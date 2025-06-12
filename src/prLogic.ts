import { getFirestore, collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';

type PRType = '1RM' | '2RM' | '3RM' | '5RM' | '8RM';

interface SetLog {
  loggedWeight: number;
  loggedReps: number;
}

interface PRCheckInput {
  userId: string;
  exerciseName: string;
  sets: SetLog[];
}

const PR_REP_MAPPING: Record<number, PRType> = {
  1: '1RM',
  2: '2RM',
  3: '3RM',
  5: '5RM',
  8: '8RM'
};

export const checkAndUpdatePRs = async ({ userId, exerciseName, sets }: PRCheckInput) => {
  const db = getFirestore();

  for (const set of sets) {
    const prType = PR_REP_MAPPING[set.loggedReps];
    if (!prType) continue; // skip if it's not a recognized PR rep range

    const q = query(
      collection(db, 'PRRecords'),
      where('userId', '==', userId),
      where('exerciseName', '==', exerciseName),
      where('prType', '==', prType)
    );

    const snapshot = await getDocs(q);

    const existingPR = snapshot.empty ? null : snapshot.docs[0].data();

    const isNewPR = !existingPR || set.loggedWeight > existingPR.value;

    if (isNewPR) {
      await addDoc(collection(db, 'PRRecords'), {
        userId,
        exerciseName,
        prType,
        value: set.loggedWeight,
        dateAchieved: Timestamp.now()
      });
    }
  }
};
