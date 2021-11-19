import { map } from 'rxjs/operators';

export const mapCollection = map((snapshot: any) => snapshot.map((a: any) => {
  const {payload} = a;
  const data: any = payload.doc.data();
  data.id = payload.doc.id;
  return data;
}));

export const mapDoc = map((snapshot: any) => {
  const {payload} = snapshot;
  if (payload.exists) {
    const data =  payload.data();
    data.id = payload.id;
    return data;
  } else {
    return null;
  }
});

