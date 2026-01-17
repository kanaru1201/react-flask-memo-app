package infra

import (
	"database/sql"
	"errors"

	"react-flask-memo-app/backend-go/domain/model"
	"react-flask-memo-app/backend-go/domain/repository"
)

type memoRepository struct {
	db *sql.DB
}

func NewMemoRepository(db *sql.DB) repository.MemoRepository {
	return &memoRepository{db}
}

func (r *memoRepository) Create(memo *model.Memo) error {
	_, err := r.db.Exec("INSERT INTO memos (owner_id, title, body) VALUES ($1, $2, $3)", memo.OwnerID, memo.Title, memo.Body)
	return err
}

func (r *memoRepository) FindAllByOwnerID(ownerID int) ([]model.Memo, error) {
	rows, err := r.db.Query("SELECT memoid, title, body, created_at FROM memos WHERE owner_id = $1 ORDER BY created_at DESC", ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var memos []model.Memo
	for rows.Next() {
		var m model.Memo
		if err := rows.Scan(&m.ID, &m.Title, &m.Body, &m.CreatedAt); err != nil {
			continue
		}
		m.OwnerID = ownerID
		memos = append(memos, m)
	}
	return memos, nil
}

func (r *memoRepository) Update(memo *model.Memo) error {
	res, err := r.db.Exec("UPDATE memos SET title = $1, body = $2 WHERE memoid = $3 AND owner_id = $4", memo.Title, memo.Body, memo.ID, memo.OwnerID)
	if err != nil {
		return err
	}
	rows, _ := res.RowsAffected()
	if rows == 0 {
		return errors.New("memo not found or unauthorized")
	}
	return nil
}

func (r *memoRepository) Delete(id, ownerID int) error {
	res, err := r.db.Exec("DELETE FROM memos WHERE memoid = $1 AND owner_id = $2", id, ownerID)
	if err != nil {
		return err
	}
	rows, _ := res.RowsAffected()
	if rows == 0 {
		return errors.New("memo not found or unauthorized")
	}
	return nil
}
