import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseModel, BaseState, PaginationState } from "../../../types/globals";
import { RootState } from "../store";
import axios from "@/appUtils/axiosConfig";

export type IQuiz = BaseModel & {
    examSubject?: {
        _id?: string;
        title?: string;
    };

    questions?: {
        _id?: string;
        text?: string;
        type?: string;
        media?: string | null;

        exam?: {
        _id?: string;
        seoTitle?: string;
        };

        examSubject?: {
        _id?: string;
        title?: string;
        };

        examSubjectBook?: {
        _id?: string;
        title?: string;
        };

        examSubjectBookChapter?: {
        _id?: string;
        title?: string;
        };

        optionOrdering?: {
        _id?: string;
        text?: string;
        media?: string | null;
        }[];

        questionInfo?: {
        _id?: string;
        question?: string;
        solution?: string;
        media?: string | null;
        option?: string;
        };
    }[];
};

const initialState = {
  quizList: {
    data: [],
    loading: false,
    error: null,
  } as BaseState<IQuiz[]>,
};

export const fetchQuizeList = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
  'fetchList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {

      dispatch(fetchQuizeListStart());

      const response = await axios.get("edzy-api/hackathon/task/quizDetails");

      if (response.status === 200) {
        dispatch(fetchQuizeListSuccess({data: response.data}));
        return response;
      } else {
        throw new Error('No status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchQuizeListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);


const QuizSlice = createSlice({
    name: "quize",
    initialState,
    reducers: {
        fetchQuizeListStart(state) {
        state.quizList.loading = true;
        state.quizList.error = null;
        },
        fetchQuizeListSuccess(state, action) {
        state.quizList.loading = false;
        state.quizList.data = action.payload;
        state.quizList.error = null;
        },
        fetchQuizeListFailure(state, action) {
        state.quizList.loading = false;
        state.quizList.error = action.payload;
        },
    }
})


export const {
    fetchQuizeListSuccess,
    fetchQuizeListStart,
    fetchQuizeListFailure
} = QuizSlice.actions;

export default QuizSlice.reducer;