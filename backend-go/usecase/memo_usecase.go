package usecase

import (
	"react-flask-memo-app/backend-go/domain/model"
	"react-flask-memo-app/backend-go/domain/repository"
)

type MemoUsecase interface {
	GetMemos(ownerID int) ([]model.Memo, error)
	CreateMemo(ownerID int, title, body string) error
	UpdateMemo(id, ownerID int, title, body string) error
	DeleteMemo(id, ownerID int) error
}

type memoUsecase struct {
	repo repository.MemoRepository
}

func NewMemoUsecase(repo repository.MemoRepository) MemoUsecase {
	return &memoUsecase{repo}
}

func (u *memoUsecase) GetMemos(ownerID int) ([]model.Memo, error) {
	return u.repo.FindAllByOwnerID(ownerID)
}

func (u *memoUsecase) CreateMemo(ownerID int, title, body string) error {
	memo, err := model.NewMemo(ownerID, title, body)
	if err != nil {
		return err
	}
	return u.repo.Create(memo)
}

func (u *memoUsecase) UpdateMemo(id, ownerID int, title, body string) error {
	memo := &model.Memo{
		ID:      id,
		OwnerID: ownerID,
		Title:   title,
		Body:    body,
	}
	if err := memo.Validate(); err != nil {
		return err
	}
	return u.repo.Update(memo)
}

func (u *memoUsecase) DeleteMemo(id, ownerID int) error {
	return u.repo.Delete(id, ownerID)
}
